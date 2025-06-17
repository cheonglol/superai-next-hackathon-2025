import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, icon, actions }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <div className="flex items-center mb-2">
          {icon && <div className="mr-3">{icon}</div>}
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        </div>
        {description && <p className="text-gray-600">{description}</p>}
      </div>
      {actions && <div className="flex items-center space-x-4">{actions}</div>}
    </div>
  );
};
