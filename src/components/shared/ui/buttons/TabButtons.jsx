function TabButtons({ tabs, activeTab, onTabChange }) {
  return (
    <div className='flex gap-2'>
      {tabs.map((tab) => (
        <button
          className='outline rounded-xl cursor-pointer px-4 py-1'
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          style={{
            fontWeight: activeTab === tab.id ? 'bold' : 'normal'
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default TabButtons;
