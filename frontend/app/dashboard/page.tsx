"use client";
import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function Dashboard() {
  const [showModal, setShowModal] = useState(true);
  const [startDate, setStartDate] = useState("");

  return (
    <div className="flex flex-col items-center justify-center text-center pt-64">
      {/* Modal */}
      <Transition appear show={showModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowModal(false)}>
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
          <div className="fixed inset-0 flex items-center justify-center">
            <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <Dialog.Title className="text-xl font-semibold text-black">
                Please enter the start date of your current job search:
              </Dialog.Title>
              <input
                type="date"
                className="mt-4 w-full p-2 border rounded-lg"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <button
                className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                onClick={() => setShowModal(false)}
              >
                Confirm
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>

      {/* Dashboard */}
      {!showModal && (
        <>
          <h1 className="text-3xl font-bold text-blue-500">Dashboard</h1>
          <p className="pt-8">Your job search start date: {startDate || "Not set"}</p>
        </>
      )}
    </div>
  );
}
