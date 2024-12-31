import { body, validationResult } from 'express-validator';

export const validateChatInput = [
    body('message')
        .trim()
        .notEmpty().withMessage('Message cannot be empty')
        .isString().withMessage('Message must be a string')
        .isLength({ max: 1000 }).withMessage('Message too long'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: 'Validation Error',
                details: errors.array() 
            });
        }
        next();
    }
];