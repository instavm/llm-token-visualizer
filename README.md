# 🔍 LLM Token Visualizer

LLM Token Visualizer is a Next.js project that helps visualize the number of tokens in different text lengths.

## ✨ Features

- 🎨 Visualize token counts using sliders
- ⚡ Built with Next.js and Tailwind CSS
- 📊 Integrated with Vercel Analytics

## 🚀 Getting Started

### 📋 Prerequisites

Ensure you have the following installed:

- 🟢 Node.js (v14.x or later)
- 📦 npm (v6.x or later)

### 📦 Installation

1. ⬇️ Clone the repository:

    ```bash
    git clone https://github.com/BandarLabs/llm-token-visualizer.git
    cd llm-token-visualizer
    ```

2. 📥 Install the dependencies:

    ```bash
    npm install
    ```

3. 🏃 Start the development server:

    ```bash
    npm run dev
    ```

    The application should now be running at `http://localhost:3000`.

### 🏗️ Building for Production

To create an optimized production build:

```bash
npm run build
npm start
```

This will build the project and start a production server.

## 🗂️ Project Structure

- `app/`: Main application files.
  - `page.tsx`: Main page component.
- `components/`: Reusable React components.
  - `TokenVisualizer.tsx`: Component for visualizing token counts.
- `public/`: Public static files.
- `styles/`: Tailwind CSS styles and global stylesheet.
- `package.json`: Project dependencies and scripts.

## 🤝 Contributing

Please open an issue or submit a pull request for any changes or improvements.

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.