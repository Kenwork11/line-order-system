import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { COOKIE_NAMES } from '@/lib/constants';

const LINE_LOGIN_CHANNEL_ID = process.env.LINE_LOGIN_CHANNEL_ID!;

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { error: 'IDトークンが必要です' },
        { status: 400 }
      );
    }

    console.log('IDトークン検証開始...');

    // 1. IDトークンを検証
    const profile = await verifyIdToken(idToken);

    if (!profile) {
      return NextResponse.json(
        { error: 'IDトークンが無効です' },
        { status: 401 }
      );
    }

    console.log('IDトークン検証成功:', profile);

    const { sub: lineUserId, name: displayName, picture: pictureUrl } = profile;

    // 2. 顧客レコード作成 or 更新
    const customer = await prisma.customer.upsert({
      where: { lineUserId },
      update: {
        lastLoginAt: new Date(),
        displayName,
        pictureUrl,
      },
      create: {
        lineUserId,
        displayName,
        pictureUrl,
      },
    });

    console.log('顧客レコード更新完了:', customer.id);

    // 3. セッション発行（Cookie）
    const response = NextResponse.json({
      id: customer.id,
      lineUserId: customer.lineUserId,
      displayName: customer.displayName,
      pictureUrl: customer.pictureUrl,
      nickname: customer.nickname,
      isActive: customer.isActive,
      createdAt: customer.createdAt.toISOString(),
      updatedAt: customer.updatedAt.toISOString(),
      lastLoginAt: customer.lastLoginAt?.toISOString() || null,
    });

    response.cookies.set(COOKIE_NAMES.LINE_CUSTOMER_ID, customer.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30日
    });

    return response;
  } catch (error) {
    console.error('LIFF認証エラー:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// IDトークン検証関数
async function verifyIdToken(idToken: string) {
  try {
    // LINEのIDトークン検証エンドポイントを使用
    const response = await fetch('https://api.line.me/oauth2/v2.1/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        id_token: idToken,
        client_id: LINE_LOGIN_CHANNEL_ID,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('IDトークン検証失敗:', errorText);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('IDトークン検証エラー:', error);
    return null;
  }
}
