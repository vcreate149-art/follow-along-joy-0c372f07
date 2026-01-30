-- Allow high-level admins to manage user_roles
CREATE POLICY "High level admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  public.get_user_admin_level(auth.uid()) >= 3
);

CREATE POLICY "High level admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (
  public.get_user_admin_level(auth.uid()) >= 3
  AND auth.uid() != user_id -- Cannot delete own role
);

CREATE POLICY "High level admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (
  public.get_user_admin_level(auth.uid()) >= 3
  AND auth.uid() != user_id -- Cannot update own role
);