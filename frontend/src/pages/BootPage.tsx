import Icn from "@/assets/Icons";

interface BootPageProps {
  onBoot: () => void;
}

const BootPage = ({ onBoot }: BootPageProps) => {
  return (
    <div className="bg-gray-1 flex h-full w-full items-center justify-center">
      <button
        onClick={onBoot}
        className="bg-gray-3 flex items-center justify-center rounded-full p-8 hover:bg-gray-600"
      >
        <Icn.PowerBig className="h-16 w-16" />
      </button>
    </div>
  );
};

export default BootPage;
