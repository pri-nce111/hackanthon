import { User } from '../../models/User.js';

describe('User Model', () => {
  describe('User Creation', () => {
    it('should create a user with required fields', async () => {
      const userData = {
        phoneNumber: '+919999999999',
        language: 'en' as const,
        preferences: {
          receiveAlerts: true,
          preferredTime: '09:00'
        }
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.phoneNumber).toBe(userData.phoneNumber);
      expect(savedUser.language).toBe(userData.language);
      expect(savedUser.isActive).toBe(true);
      expect(savedUser.preferences.receiveAlerts).toBe(true);
      expect(savedUser.createdAt).toBeDefined();
      expect(savedUser.updatedAt).toBeDefined();
    });

    it('should create a user with optional fields', async () => {
      const userData = {
        phoneNumber: '+919999999998',
        name: 'Test User',
        language: 'hi' as const,
        location: {
          state: 'Delhi',
          district: 'New Delhi',
          pincode: '110001'
        },
        age: 30,
        gender: 'male' as const,
        preferences: {
          receiveAlerts: false,
          preferredTime: '18:00'
        }
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.name).toBe(userData.name);
      expect(savedUser.location?.state).toBe(userData.location.state);
      expect(savedUser.age).toBe(userData.age);
      expect(savedUser.gender).toBe(userData.gender);
    });

    it('should fail to create user without phone number', async () => {
      const userData = {
        language: 'en' as const
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow();
    });

    it('should fail to create user with duplicate phone number', async () => {
      const phoneNumber = '+919999999997';
      
      const user1 = new User({
        phoneNumber,
        language: 'en' as const
      });
      await user1.save();

      const user2 = new User({
        phoneNumber,
        language: 'hi' as const
      });

      await expect(user2.save()).rejects.toThrow();
    });

    it('should validate age constraints', async () => {
      const userData = {
        phoneNumber: '+919999999996',
        language: 'en' as const,
        age: 150 // Invalid age
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow();
    });

    it('should validate language enum', async () => {
      const userData = {
        phoneNumber: '+919999999995',
        language: 'fr' as any // Invalid language
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow();
    });
  });

  describe('User Queries', () => {
    beforeEach(async () => {
      // Create test users
      await User.create([
        {
          phoneNumber: '+919999999994',
          language: 'en',
          location: { state: 'Delhi' },
          isActive: true,
          lastActive: new Date()
        },
        {
          phoneNumber: '+919999999993',
          language: 'hi',
          location: { state: 'Maharashtra' },
          isActive: false,
          lastActive: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
        }
      ]);
    });

    it('should find user by phone number', async () => {
      const user = await User.findOne({ phoneNumber: '+919999999994' });
      
      expect(user).toBeTruthy();
      expect(user?.language).toBe('en');
    });

    it('should find active users', async () => {
      const activeUsers = await User.find({ isActive: true });
      
      expect(activeUsers.length).toBeGreaterThan(0);
      expect(activeUsers.every(user => user.isActive)).toBe(true);
    });

    it('should find users by location', async () => {
      const delhiUsers = await User.find({ 'location.state': 'Delhi' });
      
      expect(delhiUsers.length).toBeGreaterThan(0);
      expect(delhiUsers.every(user => user.location?.state === 'Delhi')).toBe(true);
    });
  });
});