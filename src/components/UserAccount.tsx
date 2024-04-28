import { User } from "../entities";

const UserAccount = ({ user }: { user: User }) => {
  return (
    <>
      <h2>User Profile</h2>
      {user.isAdmin && <button>Edit</button>}
      <div test-id="div">
        <strong>Name:</strong> {user.name}
      </div>
    </>
  );
};

export default UserAccount;
