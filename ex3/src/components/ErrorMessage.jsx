import React from "react";

export default function ErrorMessage(props) {
    return (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50">
            {props.message}
        </div>
    );
}