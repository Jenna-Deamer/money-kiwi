function AccountList({ title, accounts }) {
    if (accounts.length === 0) return null;

    return (
        <section>
            <h2>{title}</h2>
            {accounts.map((account) => (
                <div key={account.id}>
                    <div>
                        <h3>{account.name}</h3>
                        <div>
                            <span>{account.subCategory}</span>
                            <span>{account.registration}</span>
                        </div>
                        <small>{account.institution}</small>
                    </div>
                    <div>
                        <p>{account.balance}</p>
                    </div>
                </div>
            ))}
        </section>
    );
}

export default AccountList;