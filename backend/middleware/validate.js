const { body, param, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};

const registerRules = [
  body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 8 }).withMessage('Mot de passe trop court (8 caractères minimum)'),
  body('name').trim().isLength({ min: 2, max: 100 }).escape().withMessage('Nom invalide'),
  body('role').optional().isIn(['Visiteur','Athlète','Journaliste','Staff','Volontaire']).withMessage('Rôle invalide'),
  body('country').optional().trim().isLength({ max: 100 }).escape(),
  body('countryCode').optional().isAlpha().isLength({ min: 2, max: 2 }),
  body('phone').optional().trim().isLength({ max: 30 }).escape(),
];

const loginRules = [
  body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Mot de passe requis'),
];

const walletRules = [
  param('userId').isInt({ min: 1 }).withMessage('userId invalide'),
  body('amount').isFloat({ min: 1, max: 1_000_000 }).withMessage('Montant invalide'),
  body('method').optional().trim().isLength({ max: 50 }).escape(),
  body('label').optional().trim().isLength({ max: 255 }).escape(),
  body('icon').optional().trim().isLength({ max: 60 }).escape(),
];

module.exports = { handleValidation, registerRules, loginRules, walletRules };
