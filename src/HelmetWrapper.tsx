import React, { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';

interface HelmetWrapperProps {
  title: string;
  description: string;
  children: ReactNode;
}

const HelmetWrapper: React.FC<HelmetWrapperProps> = ({ title, description, children }) => (
  <>
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
    {children}
  </>
);

export default HelmetWrapper;
