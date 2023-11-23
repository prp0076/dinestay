import React from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../../context/cart";
import { useAuth } from "../../context/auth";
import { Disclosure, Menu } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();

  const handleLogout = async () => {
    try {
      // Perform the API call

      // Clear user data
      setAuth({
        ...auth,
        user: null,
        token: "",
      });

      // Clear localStorage
      localStorage.clear();

      // Reload the window
      window.location.reload();

      // Show success message
      toast.success("Logout Successfully");
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const navigation = [
    {
      name: "Room",
      to: "/hotel",
      current: true,
      classes: "text-red-500 font-bold bg-black text-white",
    },
    { name: "Home", to: "/", current: true },
    { name: "Menu", to: "/menu", current: true },
    { name: "Login", to: "/login", current: true },
    { name: "Signup", to: "/register", current: true },
  ];

  const afterNavigation = [
    {
      name: "Room",
      to: "/hotel",
      current: true,
      classes: "text-red-500 font-bold bg-black text-white",
    },
    { name: "Home", to: "/", current: true },
    { name: "Menu", to: "/menu", current: true },
    {
      name: "Dashboard",
      to: `/dashboard/${
        auth?.user?.role === 1
          ? "admin"
          : auth?.user?.role === 2
          ? "manager"
          : auth?.user?.role === 3
          ? "staff"
          : "user"
      }`,
      current: true,
    },
    {
      name: auth?.user?.name || "Login", // Use the user's name if available, or "Login" if not
      to: "/dashboard/user/profile",
      current: true,
    },

    { name: "My Orders", to: "/dashboard/user/orders", current: true },
    { name: "Logout", onClick: handleLogout, to: "/", current: true },
  ];
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  return (
    <nav className="fixed top-0 w-full bg-opacity-20 backdrop-blur-lg bg-cover bg-center bg-gradient-to-b from-white to-white shadow-xl">
      {" "}
      {/* <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8"> */}
      <Disclosure as="nav" className="#fff shadow-xl">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-black hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white ">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch  sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <Link to="/">
                      <img className="h-12 w-auto" src="/image/EV.png" />
                    </Link>
                  </div>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  {!auth?.user ? (
                    <div className="flex space-x-4">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.to}
                          className={classNames(
                            item.current ? "text-black" : "text-black",
                            "rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-200 hover:text-black transition-colors duration-300",
                            item.classes
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="flex space-x-4">
                      {afterNavigation.map((item) => (
                        <Link
                          key={item.name}
                          onClick={item.onClick}
                          to={item.to}
                          className={classNames(
                            item.current ? " text-black" : "text-black",
                            "rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-200 hover:text-black transition-colors duration-300",
                            item.classes
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <Link to="/login"></Link>
                  {/* Profile dropdown */}
                  <Link to="/cart">
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <button className="relative flex rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open user menu</span>

                          <ShoppingCartIcon className="h-6 w-6 " />
                        </button>
                        <span
                          className="badge"
                          style={{
                            position: "absolute",
                            top: "-11px",
                            right: "-11px",
                            backgroundColor: "#ff5733",
                            color: "#fff",
                            borderRadius: "50%",
                            padding: "3px 7px",
                            fontSize: "10px",
                          }}
                        >
                          {cart?.length}
                        </span>
                      </div>
                    </Menu>
                  </Link>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              {!auth?.user ? (
                <div className="space-y-1 flex flex-col px-2 pb-3 pt-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.to}
                      className={classNames(
                        item.current ? " text-black" : "text-black",
                        "rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-200 hover:text-black transition-colors duration-300"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="space-y-1 flex flex-col px-2 pb-3 pt-2">
                  {afterNavigation.map((item) => (
                    <Link
                      key={item.name}
                      onClick={item.onClick}
                      to={item.to}
                      className={classNames(
                        item.current ? " text-black" : "text-black",
                        "rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-200 hover:text-black transition-colors duration-300"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      {/* </div> */}
    </nav>
  );
};

export default Header;
