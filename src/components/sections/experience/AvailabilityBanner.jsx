import React from 'react';
import { Briefcase } from 'lucide-react';

const AvailabilityBanner = () => {
  return (
    <div className="mb-12 bg-blue-500 text-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-center">
        <Briefcase className="w-6 h-6 mr-3" />
        <h3 className="text-xl font-semibold">Open to New Opportunities</h3>
      </div>
      <p className="text-center mt-2 text-blue-100">
        I am currently seeking new challenges in IT leadership, system administration, or technical roles.
        Let's connect and discuss how I can bring value to your team.
      </p>
    </div>
  );
};

export default AvailabilityBanner;