UPDATE lessons
SET body = regexp_replace(
  body,
  ':::steps\n1\. Follow \[DRSABCD\](/kb/drsabcd)\.\n2\. Keep the person still and reassure them\.\n3\. Control any bleeding with direct pressure \(around exposed bone, not on it\)\.\n4\. \*\*Immobilise\*\* the limb in the position found, using padded splints or by binding to the body / opposite limb\.\n5\. Use a sling for upper limb fractures where possible\.\n6\. Check circulation beyond the injury \(warmth, colour, pulse\) every \*\*15 minutes\*\*\. Loosen bandages if numbness or coldness develops\.\n7\. Treat for \[shock\](/kb/shock)\.\n8\. Seek medical aid\. Call \*\*000\*\* for large bones \(femur, pelvis\), open fractures, multiple fractures or signs of shock\.\n:::',
  ':::steps
1. Follow [DRSABCD](/kb/drsabcd).
2. Keep the person still and reassure them.
3. Control any bleeding with direct pressure (around exposed bone, not on it).
4. **Immobilise** the limb in the position found, using padded splints or by binding to the body / opposite limb.
5. Use a sling for upper limb fractures where possible.

:::illustration[fracture-splint-immobilise]

6. Check circulation beyond the injury (warmth, colour, pulse) every **15 minutes**. Loosen bandages if numbness or coldness develops.
7. Treat for [shock](/kb/shock).
8. Seek medical aid. Call **000** for large bones (femur, pelvis), open fractures, multiple fractures or signs of shock.
:::',
  'g'
)
WHERE id = 'ce5e1a68-c648-49aa-a196-0860095aba79'
  AND body NOT LIKE '%fracture-splint-immobilise%';