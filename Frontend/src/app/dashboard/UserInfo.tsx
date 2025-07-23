interface User {
    _id:string;
    name: string;
    email: string;
    role: string;
    profilePicture: string;
  }
  
  export default function UserInfo({ user }: { user: User }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <img src={user.profilePicture} alt={user.name} style={{ width: '5rem', height: '5rem', borderRadius: '50%' }} />
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'semibold' }}>{user.name}</h2>
          <p style={{ color: '#666' }}>{user.email}</p>
          <p style={{ color: '#666', textTransform: 'capitalize' }}>{user.role}</p>
        </div>
      </div>
    )
  }
  
  