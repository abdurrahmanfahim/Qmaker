@echo off
echo Installing updated dependencies...

echo.
echo Updating frontend dependencies...
cd /d "e:\Qmaker - new try\Qmaker"
npm install dompurify@^3.0.5
npm install jspdf@^2.5.2

echo.
echo Updating backend dependencies...
cd /d "e:\Qmaker - new try\Qmaker\backend"
npm install multer@^2.0.0

echo.
echo Dependencies updated successfully!
echo Please restart your development servers.
pause