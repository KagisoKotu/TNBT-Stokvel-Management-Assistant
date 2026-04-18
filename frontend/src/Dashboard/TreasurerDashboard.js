import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import ContributionTable from './ContributionTable'; 
import PaymentSchedule from './PaymentSchedule';

const TreasurerDashboard = () => {
  const { groupId } = useParams();

  return (
    <>
      <Navbar />
      <main>
        {}
        <ContributionTable />
        <PaymentSchedule />
      </main>
    </>
  );
};

export default TreasurerDashboard;