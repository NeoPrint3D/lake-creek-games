interface Game {
  author: string;
  authorName: string;
  authorPhoto: string;
  authorEmail: string;
  title: string;
  description: string;
  thumbnail: string;
  gameFileUrl: string;
  createdAt: string;
  id: string;
  likedBy: string[];
  likes: number;
  dislikes: number;
  views: number;
}
interface User {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  role: string;
  createdAt: string;
  likedGames: string[];
}
