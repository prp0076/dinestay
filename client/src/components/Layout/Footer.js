import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineInstagram } from "react-icons/ai";
import { AiFillLinkedin } from "react-icons/ai";
import { AiFillGoogleCircle } from "react-icons/ai";

const date = new Date();
const currentYear = date.getFullYear();

const Footer = () => {
  return (
    <div className="container-fluid ">
      {/* Footer */}
      <footer className=" bg-gray-200 ">
        <div className="text-center mb-8">
          <div className="text-6xl  content-center">let's connect us</div>

          <div className="mb-4 md:mb-0"></div>

          <div className="mb-4 md:mb-0 ">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-white text-white p-2 hover:scale-105 w-72 rounded-3xl"
            />
            <button className="bg-gray-900  text-white px-4 py-2 m-5 hover:scale-105 w-60 rounded-3xl">
              Subscribe
            </button>
          </div>
        </div>
        <div class="grid grid-cols-5 py-2 gap-2 text-center mt-4">
          <div>
            <strong>Ifood</strong>
            <p>service</p>

            <p>service2</p>
          </div>
          <div>
            <strong>about us1</strong>
            <p>service</p>
            <p>service2</p>
          </div>
          <div>
            <strong>about us2</strong>
            <p>service</p>
            <p>service2</p>
          </div>
          <div>
            <strong>about us3</strong>
            <p>service</p>
            <p>service2</p>
          </div>
          <div>
            <strong>about us3</strong>
            <p>service</p>
            <p>service2</p>
          </div>
        </div>
        ;
      </footer>
    </div>
  );
};
export default Footer;
