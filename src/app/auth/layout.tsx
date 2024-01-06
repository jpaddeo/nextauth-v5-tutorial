type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function Authayout({ children }: AuthLayoutProps) {
  return (
    <main className='h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800'>{children}</main>
  );
}
