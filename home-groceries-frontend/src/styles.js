const styles = {
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    backgroundColor: "#2a5298",
    color: "white",
    marginBottom: "20px",
  },

  container: {
    backgroundColor: "#f5f7fa",
    minHeight: "100vh",
    padding: "20px 30px",
  },

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "20px",
    boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
  },

  input: {
    padding: "10px",
    margin: "5px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    minWidth: "150px",
  },

  button: {
    padding: "10px 15px",
    backgroundColor: "#2a5298",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    margin: "5px",
  },

  deleteButton: {
    padding: "10px 15px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    margin: "5px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    backgroundColor: "white",
    boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
  },

  th: {
    padding: "12px",
    backgroundColor: "#2a5298",
    color: "white",
    textAlign: "left",
    cursor: "pointer",
  },

  td: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },

  row: {
    transition: "background-color 0.2s ease",
  },

  formSection: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    alignItems: "center",
    marginBottom: "25px",
  },

  filterSection: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    alignItems: "center",
    marginBottom: "20px",
  },
};

export default styles;
