import React, { useEffect } from 'react';

const JobsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-12 flex justify-center items-center">
      <h1 className="text-white text-5xl font-bold border-4 border-[#39FF14] p-10 rounded-xl">
        ¡HOLA JEFE! LA PÁGINA SÍ CARGA 🚀
      </h1>
    </div>
  );
};

export default JobsPage;
