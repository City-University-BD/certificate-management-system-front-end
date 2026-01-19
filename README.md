# 🎓 Certificate Management System – Frontend

A modern, responsive frontend application for managing student certificate applications and clearance workflow at **City University**.

---

## 🚀 Live Demo
🔗 **Frontend URL:** https://certificate-management-system-iota.vercel.app/

---

## 🧩 Features

### 👨‍🎓 Student
- Apply for Transcript / Provisional Certificate
- Upload SSC, HSC certificates & Signature
- Track application status
- Download & print application form

### 🧑‍🏫 Faculty / Offices
- Faculty clearance approval
- Library clearance
- Accounts clearance
- Registrar clearance
- Exam Controller review

### 📄 Application
- Fully dynamic printable document
- Digital signatures
- Status-based clearance workflow
- Payment status tracking

---

## 🛠️ Tech Stack

- ⚛️ **React**
- 🟦 **TypeScript**
- 🎨 **Tailwind CSS**
- 🧭 **React Router**
- 🌐 **REST API Integration**
- 🖨️ **Print-friendly Layout**

---

## 📁 Project Structure

src/
├── components/
├── pages/
├── routes/
├── services/
├── types/
├── assets/
├── App.tsx
└── main.tsx

yaml
Copy code

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/City-University-BD/certificate-management-system-front-end.git
cd certificate-management-system-front-end
2️⃣ Install dependencies
bash
Copy code
npm install
3️⃣ Run the development server
bash
Copy code
npm run dev
🔐 Environment Variables
Create a .env file in the root directory:

env
Copy code
VITE_API_BASE_URL=https://server-side-rho-snowy.vercel.app
🖨️ Print Support
Optimized for A4 paper

Print-only layout using CSS media queries

Signatures & clearance status rendered dynamically

📸 Screenshots
Add screenshots here if needed
![Dashboard](./screenshots/dashboard.png)

📌 Status Workflow
Role	Status Code
Exam Controller	0
Faculty	1
Library	2
Accounts	3
Registrar	4