import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';
import * as bcrypt from 'bcrypt';

const userRepo = () => AppDataSource.getRepository(User);
const JWT_SECRET = process.env.JWT_SECRET || 'urbancruise_secret_key';
const JWT_EXPIRES_IN = '7d';

// ─── Register ─────────────────────────────────────────────────────────────────
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
      return;
    }

    const existing = await userRepo().findOne({ where: { email } });
    if (existing) {
      res.status(409).json({ success: false, message: 'Email already registered.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userRepo().create({
      name,
      email,
      password: hashedPassword,
    });

    await userRepo().save(user);

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: {
        user: { id: user.id, name: user.name, email: user.email },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during registration.', error });
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const user = await userRepo().findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        user: { id: user.id, name: user.name, email: user.email },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during login.', error });
  }
};

// ─── Get current user profile ─────────────────────────────────────────────────
export const getProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await userRepo().findOne({ where: { id: req.user.id } });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      data: { id: user.id, name: user.name, email: user.email},
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.', error });
  }
};