const projectId = process.env.VITE_FIREBASE_PROJECT_ID;

export async function verifyIdToken(idToken: string): Promise<{ uid: string }> {
  try {
    const parts = idToken.split('.');
    if (parts.length !== 3) {
      throw new Error("Invalid token format");
    }
    
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    
    if (!payload.user_id && !payload.sub) {
      throw new Error("Missing user ID in token");
    }
    
    if (payload.aud !== projectId) {
      throw new Error("Invalid audience");
    }
    
    const exp = payload.exp * 1000;
    if (Date.now() >= exp) {
      throw new Error("Token expired");
    }
    
    return { uid: payload.user_id || payload.sub };
  } catch (error) {
    console.error("Token verification error:", error);
    throw new Error("Invalid token");
  }
}
