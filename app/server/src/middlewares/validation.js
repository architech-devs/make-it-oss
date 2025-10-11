function sanitizeString(str) {
  return String(str)
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/`/g, "&#96;");
}

function sanitizeKey(key) {
  return key.replace(/^\$+/g, "").replace(/\./g, "_");
}

function sanitizeInPlace(obj) {
  if (obj == null || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i += 1) {
      const v = obj[i];
      if (v == null) continue;
      if (typeof v === "string") obj[i] = sanitizeString(v.trim());
      else if (typeof v === "object") sanitizeInPlace(v);
    }
    return obj;
  }

  const sanitized = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = sanitizeKey(k);
    if (v == null) {
      sanitized[key] = v;
    } else if (typeof v === "string") {
      sanitized[key] = sanitizeString(v.trim());
    } else if (typeof v === "object") {
      const temp = Array.isArray(v) ? [...v] : { ...v };
      sanitizeInPlace(temp);
      sanitized[key] = temp;
    } else {
      sanitized[key] = v;
    }
  }

  for (const k of Object.keys(obj)) {
    delete obj[k];
  }
  Object.assign(obj, sanitized);
  return obj;
}

export function sanitizeMiddleware() {
  return (req, _res, next) => {
    try {
      if (req.body && typeof req.body === "object") {
        sanitizeInPlace(req.body);
      }
      if (req.query && typeof req.query === "object") {
        sanitizeInPlace(req.query);
      }
      if (req.params && typeof req.params === "object") {
        sanitizeInPlace(req.params);
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}

export function validateBody(schema) {
  return (req, res, next) => {
    const errors = [];
    for (const [field, rules] of Object.entries(schema || {})) {
      const val = req.body?.[field];
      if (rules.required && (val === undefined || val === null || val === "")) {
        errors.push({ field, message: "is required" });
        continue;
      }
      if (val !== undefined && rules.type) {
        const actual = Array.isArray(val) ? "array" : typeof val;
        if (actual !== rules.type) {
          errors.push({
            field,
            message: `must be of type ${rules.type}, got ${actual}`,
          });
        }
      }
      if (val !== undefined && rules.minLength && typeof val === "string") {
        if (val.length < rules.minLength) {
          errors.push({
            field,
            message: `must have length >= ${rules.minLength}`,
          });
        }
      }
      if (val !== undefined && rules.maxLength && typeof val === "string") {
        if (val.length > rules.maxLength) {
          errors.push({
            field,
            message: `must have length <= ${rules.maxLength}`,
          });
        }
      }
    }

    if (errors.length) {
      return res.status(400).json({ error: "Validation failed", details: errors });
    }
    next();
  };
}
