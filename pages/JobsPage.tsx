import React, { useEffect } from 'react';
import JobBoard from '../components/JobBoard';

const JobsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12">
      <JobBoard />
    </div>
  );
};

export default JobsPage;
