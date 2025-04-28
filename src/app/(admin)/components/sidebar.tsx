// src/app/(admin)/components/sidebar.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  FolderIcon,
  UsersIcon,
  DocumentDuplicateIcon,
  ChartPieIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Products", href: "/products", icon: FolderIcon },
  { name: "Categories", href: "/categories", icon: FolderIcon },
  { name: "Orders", href: "orders", icon: DocumentDuplicateIcon },
  { name: "Customers", href: "/customers", icon: UsersIcon },
  { name: "Promotions", href: "/promotions", icon: ChartPieIcon },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // Sidebar closed by default

  return (
    <>
      {/* Hamburger Button */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-300 hover:text-white bg-gray-800 rounded-md focus:outline-none"
        >
          {isOpen ? (
            <XMarkIcon className="size-6" aria-hidden="true" />
          ) : (
            <Bars3Icon className="size-6" aria-hidden="true" />
          )}
          <span className="sr-only">Toggle sidebar</span>
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={classNames(
          "fixed inset-y-0 left-0 z-40 w-72 flex-col bg-gray-800 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6">
          <div className="flex h-16 shrink-0 items-center">
            <img alt="Halcones Boots" src="/logo.png" className="h-8 w-auto" />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isCurrent = pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={classNames(
                            isCurrent
                              ? "bg-gray-700 text-white"
                              : "text-gray-400 hover:bg-gray-700 hover:text-white",
                            "group flex gap-x-3 rounded-md p-2 text-sm font-semibold"
                          )}
                          onClick={() => setIsOpen(false)} // Close on click
                        >
                          <item.icon
                            aria-hidden="true"
                            className="size-6 shrink-0"
                          />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
              <li className="-mx-6 mt-auto">
                <a
                  href="#"
                  className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-700"
                >
                  <img
                    alt="Admin Profile"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    className="size-8 rounded-full bg-gray-700"
                  />
                  <span className="sr-only">Your profile</span>
                  <span aria-hidden="true">Admin User</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/80 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
