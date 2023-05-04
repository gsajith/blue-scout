type ProgressBarProps = {
  min: number;
  max: number;
  message?: string;
};
const ProgressBar = ({ min = 50, max = 100, message }: ProgressBarProps) => {
  console.log((min / max) * 100);
  return (
    <div className="w-full bg-[#050505] rounded-2xl overflow-hidden relative h-[30px] flex justify-center items-center">
      <div
        className="absolute bg-[#474887] w-[50%] h-full left-0 transition-all"
        style={{ width: (min / max) * 100 + '%' }}
      />
      <div className="z-10 drop-shadow filter">
        {message || 'Processing...'} {'(' + min + '/' + max + ')'}
      </div>
    </div>
  );
};

export default ProgressBar;
