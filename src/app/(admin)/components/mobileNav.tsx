// src/app/(admin)/components/mobilenav.tsx
"use client"; // Keep this as a client component
import React, { useState } from "react"; // Add useState import
import Link from "next/link";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  FolderIcon,
  UsersIcon,
  DocumentDuplicateIcon,
  ChartPieIcon,
  CogIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: HomeIcon,
    current: true,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: FolderIcon,
    current: false,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: FolderIcon,
    current: false,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: DocumentDuplicateIcon,
    current: false,
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: UsersIcon,
    current: false,
  },
  {
    name: "Promotions",
    href: "/admin/promotions",
    icon: ChartPieIcon,
    current: false,
  },
  { name: "Settings", href: "/admin/settings", icon: CogIcon, current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// Remove the props interface since we're managing state internally
export default function MobileNav() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Add state management here

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-800 px-4 py-4 shadow-xs sm:px-6 lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="-m-2.5 p-2.5 text-gray-300 lg:hidden"
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon aria-hidden="true" className="size-6" />
        </button>
        <div className="flex-1 text-sm font-semibold text-white">Dashboard</div>
        <a href="#">
          <span className="sr-only">Your profile</span>
          <img
            alt="Admin Profile"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            className="size-8 rounded-full bg-gray-700"
          />
        </a>
      </div>

      <Dialog
        open={sidebarOpen}
        onClose={setSidebarOpen}
        className="relative z-50 lg:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />
        <div className="fixed inset-0 flex">
          <DialogPanel
            transition
            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <TransitionChild>
              <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="-m-2.5 p-2.5"
                >
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon aria-hidden="true" className="size-6 text-white" />
                </button>
              </div>
            </TransitionChild>
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-800 px-6 pb-2 ring-1 ring-white/10">
              <div className="flex h-16 shrink-0 items-center">
                <img
                  alt="Halcones Boots"
                  src="/logo.png"
                  className="h-8 w-auto"
                />
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className={classNames(
                              item.current
                                ? "bg-gray-700 text-white"
                                : "text-gray-400 hover:bg-gray-700 hover:text-white",
                              "group flex gap-x-3 rounded-md p-2 text-sm font-semibold"
                            )}
                          >
                            <item.icon
                              aria-hidden="true"
                              className="size-6 shrink-0"
                            />
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
