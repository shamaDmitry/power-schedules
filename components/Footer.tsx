const Footer = () => {
  return (
    <footer className="max-w-7xl mx-auto w-full p-4 border-t">
      <p className="text-center text-sm">
        © {new Date().getFullYear()} Графіки відключень електроенергії в м.
        Запоріжжя
      </p>
    </footer>
  );
};

export default Footer;
