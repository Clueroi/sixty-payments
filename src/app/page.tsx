import Link from 'next/link';
import { Button } from './components/ui/button/button';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Hello World</h1>
      <Link href={'/dashboard'}>
        <Button>Go to Dashboard</Button>
      </Link>
    </div>
  );
}
