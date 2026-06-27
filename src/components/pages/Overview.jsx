const date = new Date();
const month = date.toLocaleString('default', { month: 'long' });
const day = date.getDate();

function Overview() {
    return (
      <>
        <section>
          <h1>{month} Summary</h1>
        </section>
      </>
    );
}

export default Overview;
