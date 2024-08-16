// lib/mongodb.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
/*async以下
キャッシュされた接続が存在する場合: cached.conn が存在する場合、それを返します。これにより、毎回新しい接続を作成する必要がなくなります。
キャッシュされた接続がない場合: 新しい接続を作成します。mongoose.connect メソッドを使って、MONGODB_URI を使用してデータベースに接続します。オプションとして 
bufferCommands: false が設定されています。これは、Mongoose のデフォルトのバッファリング動作を無効にするものです。
接続が確立された後: cached.conn に接続が格納され、それが返されます。*/