import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { UsersService } from '../users/users.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private supabase;

  constructor(private usersService: UsersService) {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true
        }
      }
    );
  }

  async signUp(userData: { email: string; password: string; name: string }) {
    try {
      // Validação básica de email
      if (!userData.email || !userData.email.includes('@') || !userData.email.includes('.')) {
        throw new UnauthorizedException('Email inválido');
      }

      // Validação de senha
      if (!userData.password || userData.password.length < 6) {
        throw new UnauthorizedException('Senha deve ter no mínimo 6 caracteres');
      }

      // Primeiro registramos no Supabase
      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        email: userData.email.toLowerCase(),
        password: userData.password,
        options: {
          emailRedirectTo: null,
          data: {
            name: userData.name
          }
        }
      });

      if (authError) {
        throw new UnauthorizedException(authError.message);
      }

      // Depois criamos no nosso banco
      const user = await this.usersService.create({
        id: authData.user.id, // Usando o ID gerado pelo Supabase
        email: userData.email.toLowerCase(),
        name: userData.name,
        password: userData.password
      });

      // Fazemos login imediatamente após o registro
      const { data: sessionData, error: loginError } = await this.supabase.auth.signInWithPassword({
        email: userData.email.toLowerCase(),
        password: userData.password,
      });

      if (loginError) {
        throw new UnauthorizedException('Erro ao fazer login após registro');
      }

      return {
        user,
        session: sessionData?.session,
      };
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Erro durante o registro');
    }
  }

  async signOut(userId: string): Promise<{ message: string }> {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      throw new UnauthorizedException(error.message);
    }
    return { message: 'Desconectado com sucesso' };
  }

  async validateUser(token: string) {
    const { data: { user }, error } = await this.supabase.auth.getUser(token);
    if (error) return null;
    return this.usersService.findOne(user.id);
  }

  async signIn(email: string, password: string) {
    try {
      const user = await this.usersService.findByEmail(email.toLowerCase());
  
      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
      }
  
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: password,
      });
  
      if (error) {
        if (error.message === 'Email not confirmed') {
          throw new UnauthorizedException('Por favor, confirme seu email antes de fazer login');
        }
        throw new UnauthorizedException('Email ou senha incorretos');
      }
  
      return {
        user,
        session: data.session,
      };
    } catch (error) {
      if (error.message === 'Email not confirmed') {
        throw new UnauthorizedException('Por favor, confirme seu email antes de fazer login');
      }
      throw new UnauthorizedException(error.message || 'Credenciais inválidas');
    }
  }
}