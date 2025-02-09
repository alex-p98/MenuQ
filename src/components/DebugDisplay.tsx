import { useMenu } from "../context/MenuContext";

export const DebugDisplay = () => {
  const { menuItems } = useMenu();

  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="fixed bottom-0 right-0 p-2 bg-black/50 text-white text-xs">
      <pre className="max-w-xs overflow-auto">
        {JSON.stringify(menuItems, null, 2)}
      </pre>
    </div>
  );
};

export default DebugDisplay;
