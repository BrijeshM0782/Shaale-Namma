# Shale-Namma – School Transparency & Pride Portal

An Android app that helps government schools share daily updates, facilities, and achievements with parents in real time.

---

## Problem Statement

Government schools have improved a lot — but parents don't know about it. There is no platform to show school facilities, meals, or achievements to parents. This leads to low enrollment and lack of trust.

Shale-Namma solves this by giving schools a simple app to share updates, and parents a place to view them.

---

## Features

- Daily meal photo and description (one upload per day)
- Facility tour with image slider (Labs, Library, Toilets)
- Student achievements showcase
- Anonymous feedback from parents
- English / Kannada language toggle
- Admin login to upload content
- Parents can use the app without login

---

## Tech Stack

- **Language** – Kotlin
- **IDE** – Android Studio
- **Architecture** – MVVM
- **Database** – Firebase Realtime Database
- **Authentication** – Firebase Auth
- **Image Storage** – Cloudinary (free)
- **Navigation** – Jetpack Navigation Component
- **Image Loading** – Glide
- **AI** – Generative AI API

---

## Installation

**1. Clone the repo**
```bash
git clone https://github.com/BrijeshM0782/ShaleNamma.git
cd ShaleNamma
```

**2. Add Firebase**
- Create a project at [console.firebase.google.com](https://console.firebase.google.com)
- Add Android app with package name `com.shalenamma`
- Download `google-services.json` and place it inside the `app/` folder
- Enable Email/Password Authentication and create an admin user
- Enable Realtime Database

**3. Add Cloudinary**
- Sign up free at [cloudinary.com](https://cloudinary.com)
- Create an unsigned upload preset named `shalenamma`
- Open `CloudinaryUploader.kt` and replace:
```kotlin
private const val CLOUD_NAME = "YOUR_CLOUD_NAME"
private const val UPLOAD_PRESET = "shalenamma"
```

**4. Open in Android Studio**
- Open the project folder
- Wait for Gradle sync to complete

---

## Run

Click the **Run ▶** button in Android Studio, or:

```bash
./gradlew installDebug
```


---

## Demo

- Video: [YouTube Link](https://youtube.com/your-link)
- APK: [Download](https://github.com/BrijeshM0782/ShaleNamma/releases)

---

## Folder Structure

```
ShaleNamma/
## Project Structure

```bash
├── android/
│   ├── app/
│   │   ├── src/
│   │   ├── .gitignore
│   │   ├── build.gradle
│   │   ├── capacitor.build.gradle
│   │   └── proguard-rules.pro
│   │
│   ├── gradle/
│   │   └── wrapper/
│   │
│   ├── .gitignore
│   ├── build.gradle
│   ├── capacitor.settings.gradle
│   ├── gradle.properties
│   ├── gradlew
│   ├── gradlew.bat
│   ├── settings.gradle
│   └── variables.gradle
│
├── dist/
│
├── src/
│   ├── lib/
│   │   ├── cloudinary.ts
│   │   ├── firebase.ts
│   │   └── utils.ts
│   │
│   ├── services/
│   │   └── db.ts
│   │
│   ├── views/
│   │   ├── AdminView.tsx
│   │   ├── FacilityView.tsx
│   │   ├── FeedbackView.tsx
│   │   ├── HomeView.tsx
│   │   ├── LoginView.tsx
│   │   └── StudentsView.tsx
│   │
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
│
├── .gitignore
├── README.md
├── capacitor.config.ts
├── firebase-applet-config.json
├── firebase-blueprint.json
├── firestore.rules
├── index.html
├── metadata.json
├── package-lock.json
├── package.json
├── tsconfig.json
└── vite.config.ts
```
```

---

## Future Improvements

- Push notifications for new updates
- Offline mode using Room Database
- Multi-school support
- Analytics dashboard for admins
- AI chatbot for parent queries
- Student attendance tracking

---

## Author

**Brijesh M** — Atria Institute of Technology, CSE Department, 2025–26

Internship guide: Farhana Kausar

GitHub: BrijeshM0782(https://github.com/BrijeshM0782)

