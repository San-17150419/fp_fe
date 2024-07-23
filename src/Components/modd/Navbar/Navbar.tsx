import React, {
  type AnchorHTMLAttributes,
  type ImgHTMLAttributes,
} from "react";

type NavbarProps = {
  children?: React.ReactNode;
};
export default function Navbar({ children }: NavbarProps) {
  return (
    <nav className="nav-custom flex h-16 items-center justify-start gap-8 px-4 py-2 shadow shadow-black">
      {children}
    </nav>
  );
}

type NavbarLogoProps = ImgHTMLAttributes<HTMLImageElement>;

function NavbarLogo({ src }: NavbarLogoProps) {
  return <img className="w-48 object-contain" src={src} alt="" />;
}

type NavbarItemsProps = {
  className?: string;
  children: React.ReactNode;
};

function NavbarItems({ className = "", children }: NavbarItemsProps) {
  return (
    <ul
      className={"flex h-full content-center justify-center gap-8 " + className}
    >
      {children}
    </ul>
  );
}

type NavbarItemProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  text?: string;
  children?: React.ReactNode;
};

function NavbarItem({
  children,
  className = "",
  text,
  ...props
}: NavbarItemProps) {
  return (
    <li className="my-2">
      <a
        className={"my-auto font-bold text-white " + className}
        href=""
        {...props}
      >
        {text || children}
      </a>
    </li>
  );
}

Navbar.Logo = NavbarLogo;
Navbar.Items = NavbarItems;
Navbar.Item = NavbarItem;
