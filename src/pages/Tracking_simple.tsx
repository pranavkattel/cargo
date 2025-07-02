import React from 'react';

const Tracking: React.FC = () => {
  return (
    <div className="pt-16">
      <section className="text-white py-20" style={{ background: 'linear-gradient(to right, #0096C7, #007bb3)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Track Your Cargo
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Simple tracking page - testing import/export
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tracking;
