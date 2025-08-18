import CategoryComponent from '@/components/CategoryComponent';
import FooterComponent from '@/components/FooterComponent';
import HeaderComponent from '@/components/HeaderComponent';
import React from 'react';

const LayOut: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <HeaderComponent />
      <CategoryComponent />
      {children}
      <FooterComponent />
    </>
  );
};

export default LayOut;