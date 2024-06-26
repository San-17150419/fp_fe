import React, {
  type AnchorHTMLAttributes,
  type LiHTMLAttributes,
  type ImgHTMLAttributes,
  useEffect,
} from "react";

import { FiMenu } from "react-icons/fi";

type NavbarProps = {
  children?: React.ReactNode;
};
export default function Navbar({ children }: NavbarProps) {
  return (
    <nav className="nav-custom flex min-h-20 items-center justify-start gap-8 px-4 py-2 shadow-2xl shadow-black">
      {children}
    </nav>
  );
}

type NavbarLogoProps = ImgHTMLAttributes<HTMLImageElement>;

function NavbarLogo({ src }: NavbarLogoProps) {
  return <img className="w-48 object-contain" src={src} alt="" />;
}

type NavbarItemsProps = LiHTMLAttributes<HTMLUListElement> & {
  children?: React.ReactNode;
};
function NavbarItems({
  className: className = "",
  children,
}: NavbarItemsProps) {
  return <ul className={"flex h-full gap-8" + className}>{children}</ul>;
}

type NavbarItemProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  text?: string;
  children?: React.ReactNode;
};

function NavbarItem({
  children,
  className: className = "",
  text,
  ...props
}: NavbarItemProps) {
  return (
    <li className="mb-4 mt-auto">
      <a className={"font-bold text-white " + className} href="" {...props}>
        {text || children}
      </a>
    </li>
  );
}

Navbar.Logo = NavbarLogo;
Navbar.Items = NavbarItems;
Navbar.Item = NavbarItem;
