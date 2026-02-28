function Layout({ children }) {
  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-12 pt-8 sm:px-6 lg:px-8 lg:pt-12">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-16 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -right-16 top-0 h-72 w-72 rounded-full bg-indigo-400/10 blur-3xl" />
      </div>
      {children}
    </div>
  );
}

export default Layout;
