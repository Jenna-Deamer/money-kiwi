function TabButtons({ tabs, activeTab, onTabChange }) {
    return (
        <div>
            {tabs.map((tab) => (
                <button
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
