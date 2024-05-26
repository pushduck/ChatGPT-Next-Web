import { withMiddlewareAuthRequired, getSession } from '@auth0/nextjs-auth0/edge';
import { NextRequest, NextResponse } from 'next/server';

// https://github.com/auth0/nextjs-auth0/blob/main/EXAMPLES.md
export default withMiddlewareAuthRequired();