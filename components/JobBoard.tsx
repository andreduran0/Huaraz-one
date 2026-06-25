import React from 'react';
import { jobsData, JobOffer } from '../data/jobsData';

const JobBoard: React.FC = () => {

  const handleApply = (job: JobOffer) => {
    const message = encodeURIComponent(`Hola, vi su oferta de ${job.title} en Huaraz Explorer y me gustaría postular.`);
    const contact = job.whatsappContact.startsWith('51') ? job.whatsappContact : `51${job.whatsappContact}`;
    const whatsappUrl = `https://wa.me/${contact}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="py-20 px-6 max-w-7xl mx-auto font-['Plus_Jakarta_Sans'] bg-black min-h-screen">
      <div className="mb-16 text-center">
        <h2 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter mb-4">
          Bolsa de <span className="text-green-600">Trabajo</span>
        </h2>
        <p className="text-slate-600 font-black uppercase tracking-[0.4em] text-[10px]">
          Oportunidades exclusivas en los mejores negocios de Huaraz
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {jobsData.map((job) => (
          <div key={job.id} className="bg-gray-900/40 backdrop-blur-sm rounded-[3rem] p-10 border border-green-900/30 hover:border-green-600/50 transition-all duration-700 group flex flex-col h-full shadow-2xl">
            <div className="flex flex-col h-full relative z-10">
              <div className="mb-8">
                <span className="bg-green-900/20 text-green-500 text-[9px] font-black uppercase tracking-[0.3em] px-6 py-3 rounded-full border border-green-900/40">
                  {job.businessName}
                </span>
              </div>
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-6 group-hover:text-green-500 transition-colors leading-none">
                {job.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-10 flex-grow font-medium">
                {job.description}
              </p>
              <div className="flex items-center justify-between mt-auto pt-8 border-t border-white/5">
                <div className="space-y-1">
                  <p className="text-slate-700 text-[8px] font-black uppercase tracking-widest">Compensación</p>
                  <p className="text-white font-black italic text-lg">{job.salary}</p>
                </div>
                <button onClick={() => handleApply(job)} className="bg-green-700 text-black px-8 py-4 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest hover:bg-green-500 transition-all active:scale-95 shadow-[0_10px_30px_rgba(22,163,74,0.3)] flex items-center gap-3">
                  Postular <i className="fab fa-whatsapp text-lg"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobBoard;
