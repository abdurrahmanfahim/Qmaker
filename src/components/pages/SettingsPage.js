import React, { useState } from "react";
import {
  ArrowLeftIcon,
  UserCircleIcon,
  SunIcon,
  MoonIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { useHapticFeedback } from "../../hooks/useSwipeGestures";
import usePaperStore from "../../store/paperStore";
import Button from "../common/Button";
import { useI18n } from "../../hooks/useI18n";

const SettingsPage = ({ onBack, onShowProfile, onShowPreferences }) => {
  const { darkMode, toggleDarkMode, uiLanguage, setUILanguage } =
    usePaperStore();
  const { lightTap } = useHapticFeedback();
  const [showAbout, setShowAbout] = useState(false);
  const { t } = useI18n();

  const languages = [
    { code: "bangla", name: "বাংলা" },
    { code: "english", name: "English" },
    { code: "arabic", name: "العربية" },
    { code: "urdu", name: "اردو" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
              <ArrowLeftIcon className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {t("Settings")}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {t("Manage your preferences")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8 pb-24">
        <div className="space-y-6">
          {/* UI Language Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 p-6">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">
              {t("UI Language")}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {t("Choose your preferred interface language")}
            </p>
            <div className="flex gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setUILanguage(lang.code);
                  }}
                  className={`flex-1 px-3 py-2.5 text-sm font-medium rounded-lg border transition-colors text-center ${
                    uiLanguage === lang.code
                      ? "bg-[#09302f] dark:bg-[#4ade80] text-white border-[#09302f] dark:border-[#4ade80]"
                      : "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500"
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* User Profile */}
          <button
            onClick={() => {
              console.log("Profile clicked");
              onShowProfile();
            }}
            className="w-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 p-4 sm:p-6 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 text-left group hover:scale-[1.01]"
          >
            <div className="flex items-center w-full">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center group-hover:from-[#09302f] group-hover:to-[#072625] dark:group-hover:from-[#4ade80] dark:group-hover:to-[#22c55e] transition-all duration-200 mr-3 sm:mr-5">
                <UserCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-300 group-hover:text-white dark:group-hover:text-gray-900 transition-colors duration-200" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white mb-1 group-hover:text-[#09302f] dark:group-hover:text-[#4ade80] transition-colors duration-200">
                  {t("User Profile")}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {t("Manage your account and preferences")}
                </p>
              </div>
              <div className="flex-shrink-0 ml-3 sm:ml-5">
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-[#09302f] dark:group-hover:text-[#4ade80] transition-colors duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </button>

          {/* Preferences */}
          <button
            onClick={onShowPreferences}
            className="w-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 p-4 sm:p-6 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 text-left group hover:scale-[1.01]"
          >
            <div className="flex items-center w-full">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center group-hover:from-[#09302f] group-hover:to-[#072625] dark:group-hover:from-[#4ade80] dark:group-hover:to-[#22c55e] transition-all duration-200 mr-3 sm:mr-5">
                <Cog6ToothIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-300 group-hover:text-white dark:group-hover:text-gray-900 transition-colors duration-200" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white mb-1 group-hover:text-[#09302f] dark:group-hover:text-[#4ade80] transition-colors duration-200">
                  {t("Preferences")}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {t("Font and paper layout settings")}
                </p>
              </div>
              <div className="flex-shrink-0 ml-3 sm:ml-5">
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-[#09302f] dark:group-hover:text-[#4ade80] transition-colors duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </button>

          {/* Dark Mode */}
          <button
            onClick={() => {
              console.log("Dark mode clicked");
              toggleDarkMode();
            }}
            className="w-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 p-4 sm:p-6 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 text-left group hover:scale-[1.01]"
          >
            <div className="flex items-center w-full">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center group-hover:from-[#09302f] group-hover:to-[#072625] dark:group-hover:from-[#4ade80] dark:group-hover:to-[#22c55e] transition-all duration-200 mr-3 sm:mr-5">
                {darkMode ? (
                  <MoonIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-300 group-hover:text-white dark:group-hover:text-gray-900 transition-colors duration-200" />
                ) : (
                  <SunIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-300 group-hover:text-white dark:group-hover:text-gray-900 transition-colors duration-200" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white mb-1 group-hover:text-[#09302f] dark:group-hover:text-[#4ade80] transition-colors duration-200">
                  {t("Dark Mode")}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {t("Switch between light and dark theme")}
                </p>
              </div>
              <div className="flex-shrink-0 ml-3 sm:ml-5">
                <div
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    darkMode
                      ? "bg-[#09302f] dark:bg-[#4ade80]"
                      : "bg-gray-200 dark:bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      darkMode ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </div>
              </div>
            </div>
          </button>

          {/* About */}
          <button
            onClick={() => setShowAbout(true)}
            className="w-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 p-4 sm:p-6 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 text-left group hover:scale-[1.01]"
          >
            <div className="flex items-center w-full">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center group-hover:from-[#09302f] group-hover:to-[#072625] dark:group-hover:from-[#4ade80] dark:group-hover:to-[#22c55e] transition-all duration-200 mr-3 sm:mr-5">
                <InformationCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-300 group-hover:text-white dark:group-hover:text-gray-900 transition-colors duration-200" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white mb-1 group-hover:text-[#09302f] dark:group-hover:text-[#4ade80] transition-colors duration-200">
                  {t("About Qmaker")}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {t("Version 1.0.0 - Question Paper Builder")}
                </p>
              </div>
              <div className="flex-shrink-0 ml-3 sm:ml-5">
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-[#09302f] dark:group-hover:text-[#4ade80] transition-colors duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t("About Qmaker")}
                </h2>
                <button
                  onClick={() => setShowAbout(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Version 1.0.0
                  </h3>
                  <p>
                    A comprehensive multilingual question paper builder designed
                    specifically for teachers in madrasas, schools, and coaching
                    centers.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Developer
                  </h3>
                  <p className="mb-2">
                    Created with ❤️ by{" "}
                    <span className="font-medium">Abdur Rahman Fahim</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
