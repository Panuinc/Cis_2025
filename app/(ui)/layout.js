export default function UiLayout({ children }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-danger border-dashed">
      <div className="flex flex-row items-center justify-center w-full h-24 p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed rounded-full">
          <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            logo
          </div>
          <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            CIS
          </div>
        </div>
        <div className="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed rounded-full">
          <div className="flex items-center justify-center w-12 h-full p-2 gap-2 border-2 border-dark border-dashed rounded-full">
            1
          </div>
          <div className="flex items-center justify-center w-12 h-full p-2 gap-2 border-2 border-dark border-dashed rounded-full">
            1
          </div>
          <div className="flex items-center justify-center w-12 h-full p-2 gap-2 border-2 border-dark border-dashed rounded-full">
            1
          </div>
          <div className="flex items-center justify-center w-12 h-full p-2 gap-2 border-2 border-dark border-dashed rounded-full">
            1
          </div>
          <div className="flex items-center justify-center w-12 h-full p-2 gap-2 border-2 border-dark border-dashed rounded-full">
            1
          </div>
          <div className="flex items-center justify-center w-12 h-full p-2 gap-2 border-2 border-dark border-dashed rounded-full">
            1
          </div>

          <div className="flex items-center justify-center w-12 h-full p-2 gap-2 border-2 border-dark border-dashed rounded-full">
            1
          </div>
        </div>
        <div className="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed rounded-full">
          <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            Search
          </div>
          <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            Bell
          </div>
          <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            Images
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        Contents
      </div>
    </div>
  );
}
