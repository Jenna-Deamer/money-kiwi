function TabButtons({ tabs, activeTab, onTabChange }) {
  return (
    <div className='flex gap-2'>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type='button'
            onClick={() => onTabChange(tab.id)}
            className={`cursor-pointer rounded-lg border px-4 py-1.5 text-small transition-colors focus-primary ${
              isActive
                ? 'border-kiwi-primary bg-kiwi-primary font-semibold text-white'
                : 'border-soft bg-canvas-card font-medium text-txt-muted hover:bg-surface-muted hover:text-txt-main'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export default TabButtons;
