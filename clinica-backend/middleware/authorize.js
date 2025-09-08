// middleware/authorize.js

/**
 * Middleware para controle de acesso baseado em roles
 * Exemplo de uso:
 *   app.get('/admin', authenticateToken, authorize(['superadmin']), handler);
 */
function authorize(roles = []) {
  // Garante que roles seja sempre array
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    // Se não passou roles, qualquer usuário autenticado pode acessar
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    next();
  };
}

module.exports = authorize;
