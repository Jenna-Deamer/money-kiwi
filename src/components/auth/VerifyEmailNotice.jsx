function verifyEmailNotice() {
    return(
        <div>
       <h1>Verify your Email</h1>
            <p>You're almost there! Please check your inbox and click the link to unlock all features.</p>
            <button onClick={() => window.location.reload()}>I've verified, let me in!</button>
        </div>
    )
};

export default verifyEmailNotice;